class Group < ActiveRecord::Base

	has_many :relationgroups, dependent: :delete_all
	has_many :users, through: :relationgroups

	has_many :documents, dependent: :delete_all	
	accepts_nested_attributes_for :documents
end
