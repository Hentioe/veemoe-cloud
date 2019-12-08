class CreateStyles < Jennifer::Migration::Base
  def up
    create_table :styles do |t|
      t.string :name, {:null => false}
      t.string :description, {:null => false}

      t.reference :workspace, :integer, {:null => false, :on_delete => :cascade}

      t.timestamps
    end

    add_index :styles, [:workspace_id, :name], :unique
  end

  def down
    drop_index :styles, [:workspace_id, :name]
    drop_table :styles if table_exists? :styles
  end
end
