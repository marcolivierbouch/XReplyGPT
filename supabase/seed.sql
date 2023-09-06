CREATE TABLE analytics_reply_generation (
    id bigint primary key generated always as identity,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    username VARCHAR,
    to_user VARCHAR,
    prompt VARCHAR,
    gpt_model VARCHAR,
    tweet_content VARCHAR,
    reply_generated VARCHAR
);
