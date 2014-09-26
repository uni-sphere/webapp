class Document < ActiveRecord::Base
  include PublicActivity::Model
  tracked owner: Proc.new{ |controller, model| controller.set_group }
  tracked recipient: Proc.new{ |controller, model| controller.current_user }
  
	has_attached_file :file
	do_not_validate_attachment_file_type :file
	validates_attachment_presence :file

	belongs_to :user
	belongs_to :group

end
