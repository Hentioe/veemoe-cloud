class CreateStyles < Jennifer::Migration::Base
  def up
    create_table :styles do |t|
      t.string :name, {:null => false}
      t.string :description, {:null => false}

      t.timestamps
    end

    add_index(:styles, [:name], :unique)
  end

  def down
    drop_index :styles, [:name]
    drop_table :styles if table_exists? :styles
  end
end
