class CreateGroupdocuments < ActiveRecord::Migration
  def change
    create_table :groupdocuments do |t|
      t.string :box_id
      t.string :share_url
      t.string :dl_url
      t.integer :groupfolder_id
      t.string :name
      t.string :owner
      t.integer :size
      t.boolean :deleted, default: false
      t.boolean :admin, default: false
      
      t.timestamps
    end
  end
end