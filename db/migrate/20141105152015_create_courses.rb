class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.string :name
      t.decimal :average, precision: 2
      t.decimal :coefficient, default: 1
      t.integer :group_id

      t.timestamps
    end
  end
end