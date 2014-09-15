class Micropost < ActiveRecord::Base

	belongs_to :group
  validates :content, :presence => true, :length => { :maximum => 150 }
  default_scope { order('microposts.created_at ASC') } 
  
end
