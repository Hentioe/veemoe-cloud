class CreateMatches < Jennifer::Migration::Base
  def up
    create_table :matches do |t|
      t.string :expression, {:null => false}

      t.reference :workspace, :integer, {:null => false, :on_delete => :cascade}

      t.timestamps
    end

    add_index :matches, [:workspace_id, :expression], :unique
  end

  def down
    drop_index :matches, [:workspace_id, :expression]
    drop_table :matches if table_exists? :matches
  end
end
