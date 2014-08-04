class CreateRelationgroups < ActiveRecord::Migration
  def change
    create_table :relationgroups do |t|
      t.integer :user_id
      t.integer :group_id

      t.timestamps
    end
	add_index :relationgroups, :user_id
	add_index :relationgroups, :group_id
	add_index :relationgroups, [:user_id, :group_id], :unique => true
  end
end
