class CreateCalendars < ActiveRecord::Migration
  def change
    create_table :calendars do |t|
      t.integer :user_id
      t.integer :group_id
      t.string :name

      t.timestamps
    end
  end
end
