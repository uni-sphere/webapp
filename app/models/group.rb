class Group < ActiveRecord::Base

	has_many :relationgroups, dependent: :destroy
	has_many :users, through: :relationgroups

	has_many :documents, dependent: :delete_all	
	accepts_nested_attributes_for :documents
end
