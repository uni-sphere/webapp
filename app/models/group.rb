class Group < ActiveRecord::Base
  
	has_many :relationgroups, dependent: :destroy
	has_many :users, through: :relationgroups
	has_many :microposts, dependent: :destroy
	has_many :documents, dependent: :delete_all	
	accepts_nested_attributes_for :documents
	has_many :tasks, dependent: :destroy
  has_one :calendar, dependent: :destroy
  has_many :etherpads, dependent: :delete_all
  
end
