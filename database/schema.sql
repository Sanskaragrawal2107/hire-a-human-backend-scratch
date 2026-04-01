
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE ENUM_RECRUITER_STATUS AS ENUM ('pending', 'verified', 'rejected');

CREATE TYPE ENUM_JOB_TYPE AS ENUM ('internship', 'full_time', 'both');

CREATE TABLE recruiters (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name      VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    company_email     VARCHAR(255) UNIQUE NOT NULL,
    company_gstin     VARCHAR(15) UNIQUE,          
    is_email_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM_RECRUITER_STATUS DEFAULT 'pending',
    subscription_tier VARCHAR(50) DEFAULT 'free',  -- 'free', 'pro', 'enterprise'
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE engineers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name           VARCHAR(255) NOT NULL,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       TEXT NOT NULL,              -- Never store plain password
    curr_location       VARCHAR(255),
    preferred_location  VARCHAR(255),
    github_username     VARCHAR(100) UNIQUE,
    leetcode_username   VARCHAR(100),
    skills              JSONB DEFAULT '[]',         -- ["Python", "FastAPI", "React"]
    experience_years    SMALLINT DEFAULT 0,
    job_type            ENUM_JOB_TYPE,
    bio                 TEXT,
    is_open_to_hire     BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admins (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role          VARCHAR(50) DEFAULT 'admin',      -- Future: 'super_admin', 'moderator'
    created_at    TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE recruiter_verifications (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id   UUID NOT NULL REFERENCES recruiters(id) ON DELETE CASCADE,
    reviewed_by    UUID REFERENCES admins(id),      -- Which admin reviewed
    status         ENUM_RECRUITER_STATUS DEFAULT 'pending',
    rejection_msg  TEXT,                            -- Only filled if rejected
    reviewed_at    TIMESTAMPTZ,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);