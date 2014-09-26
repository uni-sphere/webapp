class Event < ActiveRecord::Base 
  include PublicActivity::Model
  tracked owner: Proc.new{ |controller, model| controller.current_user }
  
	belongs_to :calendar	

	scope :between, lambda { |start_time, end_time|
		{:conditions => ["start > ? and start < ?", Event.format_date(start_time), Event.format_date(end_time)]}
	  }

	def self.format_date(date_time)
		Time.at(date_time.to_i).to_formatted_s(:db)
	end

	def as_json(options = {})
	    {   
	    	:id => self.id,
				:title => self.title,
				:start => self.start.rfc822,
				:end => self.end.rfc822,
				:allDay => self.allDay,
				:editable => self.editable,
				:adminevent => self.adminevent
	    }
	end

end
