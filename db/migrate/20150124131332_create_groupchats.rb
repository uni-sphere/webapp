class CreateGroupchats < ActiveRecord::Migration
  def change
    create_table :groupchats do |t|
      t.string :name
      t.string :channel
      t.integer :group_id
      
      t.timestamps
    end
  end
end