require 'elasticsearch/model'

class Group < ActiveRecord::Base

  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks
    
	has_many :relationgroups, dependent: :destroy
	has_many :users, through: :relationgroups
	has_many :microposts, dependent: :destroy
	has_many :documents, dependent: :delete_all	
	accepts_nested_attributes_for :documents
	has_many :tasks, dependent: :destroy
  
end
