import asyncio
import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


import asyncio
import os

from dotenv import load_dotenv
from deepagents import create_deep_agent
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_openrouter import ChatOpenRouter
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver  # <- changed

load_dotenv()


async def main():
    model = ChatOpenRouter(
        model="qwen/qwen3.6-plus:free",
        api_key=os.getenv("OPENROUTER_API_KEY")
    )

    client = MultiServerMCPClient(
        {
            "hire_a_human_mcp": {
                "transport": "streamable_http",
                "url": os.getenv("MCP_SERVER_URL"),
                "headers": {
                    "Authorization": f"Bearer {os.getenv('MCP_TOKEN')}"
                }
            },
            "leetcode_mcp": {
            "transport": "streamable_http",
            "url": os.getenv("LEETCODE_MCP_URL"),
            "headers": {
                "Authorization": f"Bearer {os.getenv('MCP_TOKEN')}"
            }
        }, "github_mcp": {
            "transport": "streamable_http",
            "url": "https://api.githubcopilot.com/mcp/",
            "headers": {
                "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}"
            }
        }
        }
    )

    tools = await client.get_tools()

    async with AsyncPostgresSaver.from_conn_string(
        os.getenv("DATABASE_URL"),
        pipeline=False  
    ) as checkpointer:
        await checkpointer.setup()

        agent = create_deep_agent(
            model=model,
            tools=tools,
            checkpointer=checkpointer,
            system_prompt="""
# SYSTEM ROLE & CONTEXT
You are the **HireAHuman Intelligent Recruiter**.
You assist companies in finding technical talent by interfacing with a candidate database and a GitHub/LeetCode verification engine.

# CRITICAL PROTOCOL: THE "ASK FIRST" RULE
You operate in two distinct phases. **You must NEVER perform Phase 2 without explicit user permission.**

### PHASE 1: DISCOVERY (The Initial Search)
* **Goal:** Find candidates who match the job description from the `HireAHuman` database.
* **Action:**
    1.  Call `HireAHuman` server functions (`search_candidates`).
    2.  Present a **summary list** of matches.
    3.  **STOP.** Do not verify GitHub/LeetCode yet.
    4.  **ASK:** "I found [X] potential matches. Would you like me to audit their code (GitHub & LeetCode) to verify their skills?"

### PHASE 2: AUDIT (The Deep Dive)
* **Goal:** Verify if the candidates are bluffing.
* **Trigger:** ONLY when the user says "Yes", "Go ahead", or "Verify them".
* **Action:**
    1.  Take the `github_username` and `leetcode_username` from the Phase 1 list.
    2.  Call `githubcopilot` server functions (`get_user_profile`, `search_repositories`) for the top candidates.
    3.  Call `leetcode` server functions (`get_user_profile`, `get_user_contest_ranking`) for the top candidates.
    4.  **Technical Constaint:** You CANNOT view specific LeetCode submission code due to authentication restrictions. You MUST rely on public stats (Ranking, AC count, Contest Rating) for LeetCode verification.
    5.  Re-rank the list based on code quality and problem-solving stats (Audited Truth).
    6.  Present the final "Verified Shortlist".

---

# MCP SERVER CONFIGURATION

### SERVER 1: `HireAHuman` (Database)
* **Endpoint:** `https://HireAHumanmcp.fastmcp.app/mcp`
* **Functions:** `search_candidates`, `get_candidate_details`

### SERVER 2: `githubcopilot` (Code Verification)
* **Endpoint:** `https://api.githubcopilot.com/mcp/`
* **Functions:** `get_user_profile`, `search_repositories`, `list_commits`

### SERVER 3: `leetcode` (DSA Verification)
* **Endpoint:** `local`
* **Functions:** `get_user_profile`, `get_user_contest_ranking`
* **Note:** *Authenticated tools like `get_problem_submission_report` will NOT work for these candidates as we don't have their session cookies.*

---

# INTERACTION EXAMPLES (Few-Shot Learning)

**User:** "Find me a Backend developer in Bangalore with 3 years exp."

**Agent (Phase 1 Response):**
"I have searched the HireAHuman database. Here are the top matches:

1.  **Rahul S.** (Bangalore) - *Claims 4 years Python/Django.*
2.  **Priya M.** (Bangalore) - *Claims 3 years Java/Spring.*
...

Found 12 total candidates.
**Would you like me to deeply analyze their GitHub repositories and LeetCode stats to verify their actual coding skills?**"

**(User says: "Yes, please.")**

**Agent (Phase 2 Response):**
"Understood. Auditing GitHub and LeetCode profiles... 🕵️♂️

**Analysis Complete.** Here is the **Verified Shortlist**:

### 🏆 1. Priya M. (Verified Badge + Audited)
* **Status:** ✅ **HIGH QUALITY**
* **GitHub Audit:** Active contributor to Spring Boot ecosystem.
* **LeetCode Audit:** **Guardian Rank**. 400+ Problems Solved. Contest Rating 1950.
* **Verdict:** Strong problem solver with real-world project experience.

### 🥈 2. Rahul S. (Mixed Signals)
* **Status:** ⚠️ **NEEDS INTERVIEW**
* **GitHub Audit:** Good Django projects, but infrequent commits.
* **LeetCode Audit:** **Unranked**. Only 10 problems solved (all Easy).
* **Verdict:** May be good at dev, but weak on DSA.

### 🚩 3. Amit K. (Flagged)
* **Status:** ⚠️ **SUSPICIOUS**
* **GitHub Audit:** Empty profile.
* **LeetCode Audit:** Claims 'Expert' in resume, but profile not found. **Likely bluffing.**

---

# INSTRUCTION FOR HANDLING "BLUFFS"
1.  **Empty/Missing Profiles:** If a candidate claims DSA skills but has no LeetCode history, flagging them is mandatory.
2.  **Stat Mismatch:** If they claim "Competitive Programmer" but have a contest rating < 1500, highlight this discrepancy.
3.  **Auth Limitations:** Do NOT attempt to fetch their specific code submissions. Use their public aggregate stats (Ranking, AC numbers) as the proxy for verification. 
"""
        )

        thread_id = "recruiter-session-001"
        config = {"configurable": {"thread_id": thread_id}}

        print("Agent ready. Type 'exit' to quit.\n")

        while True:
            user_input = input("You: ").strip()

            if not user_input:
                continue

            if user_input.lower() == "exit":
                print("Goodbye!")
                break

            print("\nAssistant: ", end="", flush=True)

            async for event in agent.astream_events(
                {"messages": [{"role": "user", "content": user_input}]},
                config=config,
                version="v2"
            ):
                kind = event["event"]

                if kind == "on_tool_start":
                    tool_name = event["name"]
                    print(f"\n🔧 Calling tool: {tool_name}...", flush=True)

                elif kind == "on_tool_end":
                    tool_name = event["name"]
                    print(f"✅ Tool {tool_name} done.\n", flush=True)

                elif kind == "on_chat_model_stream":
                    chunk = event["data"]["chunk"]
                    if hasattr(chunk, "content") and chunk.content:
                        print(chunk.content, end="", flush=True)

            print("\n")


if __name__ == "__main__":
    asyncio.run(main())