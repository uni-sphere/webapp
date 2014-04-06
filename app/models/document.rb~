class Document < ActiveRecord::Base

	has_attached_file :file
	do_not_validate_attachment_file_type :file
	validates_attachment_presence :file

	belongs_to :user
	belongs_to :group
end
