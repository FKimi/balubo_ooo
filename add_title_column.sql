ALTER TABLE profiles ADD COLUMN title VARCHAR(100) DEFAULT '';
COMMENT ON COLUMN profiles.title IS 'ユーザーの肩書き・役職情報';
CREATE INDEX idx_profiles_title ON profiles(title);
