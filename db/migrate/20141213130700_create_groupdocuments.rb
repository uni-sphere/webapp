class CreateGroupdocuments < ActiveRecord::Migration
  def change
    create_table :groupdocuments do |t|
      t.integer :box_id
      t.integer :groupfolder_id
      t.string :name
      t.string :owner
      t.integer :size
      t.boolean :deleted, default: false
      
      
      t.timestamps
    end
  end
end