CREATE TABLE migration_versions (id integer PRIMARY KEY AUTOINCREMENT, version text NOT NULL);
CREATE TABLE workspaces (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL, description text NOT NULL, protected integer NOT NULL DEFAULT true, created_at text NOT NULL, updated_at text NOT NULL);
CREATE UNIQUE INDEX workspaces_name_idx ON workspaces (name);
CREATE TABLE IF NOT EXISTS "matches"(id integer PRIMARY KEY, expression text NOT NULL, workspace_id integer NOT NULL, created_at text NOT NULL, updated_at text NOT NULL,FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON UPDATE RESTRICT ON DELETE CASCADE);
CREATE UNIQUE INDEX matches_expression_idx ON matches (expression);
CREATE TABLE IF NOT EXISTS "pipes"(id integer PRIMARY KEY, name text NOT NULL, query_params text NOT NULL, workspace_id integer NOT NULL, created_at text NOT NULL, updated_at text NOT NULL,FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON UPDATE RESTRICT ON DELETE CASCADE);
CREATE UNIQUE INDEX pipes_name_idx ON pipes (name);
CREATE TABLE IF NOT EXISTS "styles"(id integer PRIMARY KEY, name text NOT NULL, description text NOT NULL, workspace_id integer NOT NULL, created_at text NOT NULL, updated_at text NOT NULL,FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON UPDATE RESTRICT ON DELETE CASCADE);
CREATE UNIQUE INDEX styles_name_idx ON styles (name);
