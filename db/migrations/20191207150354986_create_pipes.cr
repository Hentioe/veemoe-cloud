class CreatePipes < Jennifer::Migration::Base
  def up
    create_table :pipes do |t|
      t.string :name, {:null => false}
      t.string :query_params, {:null => false}

      t.reference :workspace, :integer, {:null => false, :on_delete => :cascade}

      t.timestamps
    end

    add_index :pipes, [:name], :unique
  end

  def down
    drop_index :pipes, [:name]
    drop_table :pipes if table_exists? :pipes
  end
end
