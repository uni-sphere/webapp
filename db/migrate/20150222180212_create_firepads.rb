class CreateFirepads < ActiveRecord::Migration
  def change
    create_table :firepads do |t|
      t.string :firebase_url
      t.string :name
      t.integer :groupfolder_id
      t.boolean :deleted, default: false
      t.string :owner
      t.boolean :admin, default: false
      
      t.timestamps
    end
  end
end