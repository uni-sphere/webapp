class EventsController < ApplicationController
  
  before_action :authenticate?
  before_action :calendar_params, only: [:create, :update]
  before_action :set_calendar, only: [:update, :create, :index, :update, :destroy]
  before_action :set_user
  before_action :correct_user? 
  before_action :set_event, only: [:update, :destroy]

	def create
		@event = @calendar.events.new(calendar_params)
		respond_to do |format|
			if @event.save
			  if current_user.is_admin? 
				  adminevent = true
					@event.update_attributes(adminevent: adminevent)	
				end
		    format.json { render action: 'index' }
	    else
				format.json { render json: @event.errors, status: :unprocessable_entity }
			end
	  end 
	end

	def update
		unless @event.adminevent == true and current_user.admin != true
	    @event = @calendar.events.find(params[:id])
	    respond_to do |format|
	      if @event.update_attributes(calendar_params)
					format.html {  }
					format.json { render action: 'index' }
	      else
			    format.html {  }
			    format.json { render json: @event.errors, status: :unprocessable_entity }
	      end
	    end
	  end
	end
	
	def destroy
		unless @event.adminevent == true and current_user.admin != true
			@event.destroy
		  respond_to do |format|
			 	format.html { redirect_to root_path }
			  format.json { head :no_content }
		 	end
    end
	end

  private

	def set_event
		@event = @calendar.events.find(params[:id])
	end

	def calendar_params
    params.require(:event).permit(:title, :start, :end, :allDay, :editable, :adminevent)
  end
  
end
