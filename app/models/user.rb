class User < ActiveRecord::Base
  include PublicActivity::Common

	has_many :relationgroups
	has_many :groups, through: :relationgroups

	has_many :documents, dependent: :delete_all
	accepts_nested_attributes_for :documents

	has_many :calendars, dependent: :delete_all

# accessor	

 	attr_accessor :password

# validation before saving

	email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

	validates :name,  :presence => true,
			:length    => { :maximum => 50 }
	validates :email, :presence => true, 
			:format     => { :with => email_regex },
			:uniqueness => { :case_sensitive => false }
	validates :password, :presence => true,
                        :confirmation  => true,
                        :length        => { :within => 6..40 }

# callbacks

	before_save :make_encrypt_password

# methods

	def has_password?(submitted_password)
    self.encrypt_password == encrypt(submitted_password)
  end

  def self.authenticate(email, submitted_password)
    user = find_by_email(email)
      return nil  if user.nil?
      return user if user.has_password?(submitted_password)
    end

  private

	def secure_hash(string)
    Digest::SHA2.hexdigest(string)
  end

	def encrypt(string)
    secure_hash("#{salt}--#{string}")
  end

  def make_salt
    secure_hash("#{Time.now.utc}--#{password}")
  end

  def make_encrypt_password
    self.salt = make_salt if new_record?
    self.encrypt_password = encrypt(password)
  end

end
