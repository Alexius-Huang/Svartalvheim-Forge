CREATE TABLE IF NOT EXISTS career_experience (
  id          SERIAL PRIMARY KEY,
  company     VARCHAR(255) NOT NULL,
  start_month INT NOT NULL,
  start_year  INT NOT NULL,
  end_month   INT,
  end_year    INT,
  position    VARCHAR(255) NOT NULL,
  tags        VARCHAR(255) [],
  description TEXT [],
  created_at  TIMESTAMP NOT NULL,
  updated_at  TIMESTAMP NOT NULL
);
