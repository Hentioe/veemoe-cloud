class CreatePipes < Jennifer::Migration::Base
  def up
    create_table :pipes do |t|
      t.string :name, {:null => false}
      t.string :query_params, {:null => false}
      t.integer :workspace_id, {:null => false}

      t.timestamps
    end

    add_foreign_key :pipes, :workspaces, column: :workspace_id, primary_key: :id, on_delete: :cascade
    add_index :pipes, [:name], :unique
  end

  def down
    drop_index :pipes, [:name]
    drop_table :pipes if table_exists? :pipes
  end
end
