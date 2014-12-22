class CreateSimpledocuments < ActiveRecord::Migration
  def change
    create_table :simpledocuments do |t|
      t.integer :user_id
      t.integer :box_id
      t.string :box_name

      t.timestamps
    end
  end
end
