class CreateGroupchats < ActiveRecord::Migration
  def change
    create_table :groupchats do |t|
      t.string :name
      t.integer :channel_id
      t.integer :group_id
      
      t.timestamps
    end
  end
end