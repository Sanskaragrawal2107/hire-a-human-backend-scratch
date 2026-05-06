from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password = "Indore#124"
hashed_pw = pwd_context.hash(password)
print(hashed_pw)