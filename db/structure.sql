CREATE TABLE migration_versions (id integer PRIMARY KEY AUTOINCREMENT, version text NOT NULL);
CREATE TABLE matches (id integer PRIMARY KEY AUTOINCREMENT, expression text NOT NULL, created_at text NOT NULL, updated_at text NOT NULL);
CREATE UNIQUE INDEX matches_expression_idx ON matches (expression);
CREATE TABLE pipes (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL, query_params text NOT NULL, created_at text NOT NULL, updated_at text NOT NULL);
CREATE UNIQUE INDEX pipes_name_idx ON pipes (name);
CREATE TABLE workspaces (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL, description text NOT NULL, protected integer NOT NULL, created_at text NOT NULL, updated_at text NOT NULL);
CREATE UNIQUE INDEX workspaces_name_idx ON workspaces (name);
CREATE TABLE styles (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL, description text NOT NULL, created_at text NOT NULL, updated_at text NOT NULL);
CREATE UNIQUE INDEX styles_name_idx ON styles (name);
