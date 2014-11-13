class Evaluation < ActiveRecord::Base 

  belongs_to :course
  has_many :marks, dependent: :delete_all
  
  validates :coefficient, numericality: { only_decimal: true , greater_than_or_equal_to: 0, less_than_or_equal_to: 1 }

end
