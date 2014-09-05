class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.time :date
      t.integer :group_id

      t.timestamps
    end
  end
end
