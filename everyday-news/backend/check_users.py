import db, models

# Create a session
session = db.SessionLocal()

# Query all users
users = session.query(models.User).all()

for user in users:
    print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}, Token: {user.session_token}")

session.close()
