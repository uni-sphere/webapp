class User < ActiveRecord::Base
  
  include Gravtastic
   gravtastic secure: true,
     filetype: :png,
     size: 38,
     rating: :G

  include PublicActivity::Common
  
	has_many :relationgroups
	has_many :groups, through: :relationgroups

	has_many :calendars, dependent: :delete_all
  
  has_one :viewparam
  has_one :confirmation
  has_one :boxtoken

# accessor	

   attr_accessor :password, :password_confirmation

# validation before saving

  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates :name, on: :update,  presence: false,
      length: { maximum: 50 }
  validates :email, on: :update, presence: false,
      format: { with: email_regex },
      uniqueness: { case_sensitive: false }
  validates :password, on: :update, presence: false,
      confirmation: true,
      length: { within: 6..40 }

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
  
  def self.import_for_involving(file, group_id, current_user)
    spreadsheet = open_spreadsheet(file)
    header = spreadsheet.row(1)
    (2..spreadsheet.last_row).each do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]
      
      if User.exists?(email: row.to_hash['email'])
        logger.info row.to_hash['email']
        relation = Relationgroup.new(group_id: group_id, user_id: User.where(email: row.to_hash['email']).first.id)
        relation.save!
      else
        @user = User.new
        @user.name = ApplicationController.helpers.random_key
        @user.email = row.to_hash['email']
        group = Group.find group_id
        @user.save and @user.create_confirmation(email_confirmed: false) and @user.create_viewparam(notification_view: '0') and @user.groups.create(name: 'My first group', admin_id: @user.id) and @user.groups.last.groupfolders.create(name: Group.last.name, parent_id: 100) and Group.last.create_calendar(name: 'group calendar') and Group.last.groupchats.create(name: 'general', channel: ApplicationController.helpers.random_key)
        UserMailer.invitation_email(@user.id, current_user.name, @user.name, row.to_hash['email'], group.name).deliver
        @relation = Relationgroup.new(user_id: @user.id, group_id: group_id)
        @relation.save!
      end
      
    end
  end
  
  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
    when ".csv" then Roo::CSV.new(file.path, csv_options: {encoding: Encoding::UTF_8})
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
    self.salt = make_salt
    self.encrypt_password = encrypt(password)
  end

end
