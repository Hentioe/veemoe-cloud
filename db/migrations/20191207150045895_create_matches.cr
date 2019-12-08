class CreateMatches < Jennifer::Migration::Base
  def up
    create_table :matches do |t|
      t.string :expression, {:null => false}
      t.integer :workspace_id, {:null => false}

      t.timestamps
    end

    add_foreign_key :matches, :workspaces, column: :workspace_id, primary_key: :id, on_delete: :cascade
    add_index :matches, [:expression], :unique
  end

  def down
    drop_index :matches, [:expression]
    drop_table :matches if table_exists? :matches
  end
end
