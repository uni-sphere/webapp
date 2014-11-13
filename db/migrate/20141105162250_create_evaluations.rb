class CreateEvaluations < ActiveRecord::Migration
  def change
    create_table :evaluations do |t|
      t.string :name
      t.decimal :average, precision: 2
      t.decimal :coefficient, default: 1
      t.integer :course_id

      t.timestamps
    end
  end
end