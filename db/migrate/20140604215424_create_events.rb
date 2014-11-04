class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :title
      t.boolean :allDay
      t.datetime :start
      t.datetime :end
      t.boolean :editable
      t.boolean :adminevent
      t.integer :calendar_id
      t.integer :user_id

      t.timestamps
    end
  end
end
