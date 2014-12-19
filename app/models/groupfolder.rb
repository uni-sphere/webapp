class Groupfolder < ActiveRecord::Base
  
	belongs_to :group
  has_many :groupdocuments, dependent: :delete_all
  
end
