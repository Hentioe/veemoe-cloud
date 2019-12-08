class CreateWorkspaces < Jennifer::Migration::Base
  def up
    create_table :workspaces do |t|
      t.string :name, {:null => false}
      t.string :description, {:null => false}
      t.bool :is_protected, {:null => false, :default => true}

      t.timestamps
    end

    add_index :workspaces, [:name], :unique
  end

  def down
    drop_index :workspaces, [:name]
    drop_table :workspaces if table_exists? :workspaces
  end
end
