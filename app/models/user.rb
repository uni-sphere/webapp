class User < ActiveRecord::Base

  include Gravtastic
   gravtastic secure: true,
     filetype: :png,
     size: 38,
     rating: :G

  include PublicActivity::Common
  
	has_many :relationgroups
	has_many :groups, through: :relationgroups

	has_many :documents, dependent: :delete_all
	accepts_nested_attributes_for :documents

	has_many :calendars, dependent: :delete_all
  
  has_one :viewparam

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
      :on        => :create,
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
  
  def self.import_for_creating(file)
    spreadsheet = open_spreadsheet(file)
    header = spreadsheet.row(1)
    (2..spreadsheet.last_row).each do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]
      user = find_by_id(row["id"]) || new
      user.attributes = row.to_hash
      user.save!
    end
  end
  
  def self.to_csv(options = {})
    CSV.generate(options) do |csv|
      csv << column_names
      all.each do |product|
        csv << product.attributes.values_at(*column_names)
      end
    end
  end
  
  def self.import_for_involving(file)
    spreadsheet = open_spreadsheet(file)
    header = spreadsheet.row(1)
    (2..spreadsheet.last_row).each do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]
      relation = Relationgroup.new
      relation.attributes = row.to_hash
      relation.save!
    end
  end
  
  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
    when ".csv" then Roo::Csv.new(file.path, nil, :ignore)
    when ".xls" then Roo::Excel.new(file.path, nil, :ignore)
    when ".xlsx" then Roo::Excelx.new(file.path, nil, :ignore)
    else raise "Unknown file type: #{file.original_filename}"
    end
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
