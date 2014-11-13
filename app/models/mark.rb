class Mark < ActiveRecord::Base
  
	belongs_to :evaluation
  
	validates :score, numericality: { only_integer: true }
  
end
