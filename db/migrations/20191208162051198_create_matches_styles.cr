class CreateMatchesStyles < Jennifer::Migration::Base
  def up
    create_table :matches_styles, id: false do |t|
      t.reference :match, :integer, {:null => false, :on_delete => :cascade}
      t.reference :style, :integer, {:null => false, :on_delete => :cascade}
    end
  end

  def down
    drop_table :matches_styles if table_exists? :matches_styles
  end
end
