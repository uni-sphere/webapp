class EventsController < ApplicationController
  
  before_action :authenticate?
  before_action :event_params, only: [:create, :update]
  before_action :set_calendar, only: [:update, :new, :create, :index, :update, :destroy, :edit]
  before_action :set_user
  before_action :correct_user? 
  before_action :set_event, only: [:update, :destroy, :edit]

  def new
    @event = @calendar.events.new
    @event.start = params[:start] if params[:start]
    @event.end = params[:end] if params[:end]
    @event.editable = true
    respond_to do |format|
      format.html { }
      format.json { }
      format.js { render 'edit.js.erb' }
    end
  end
  
  def index
    @events = @calendar.events.all
    respond_to do |format|
      format.html { }
      format.json { render json: @events  }
    end
  end
  
  def create
    @event = @calendar.events.new(event_params)
    @event.user_id = params[:user_id] if params[:user_id]
    respond_to do |format|
      if @event.save
        if current_user.admin?
          adminevent = true
          @event.update_attributes(adminevent: adminevent)
        end
        format.json { render json: @event }
      else
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def edit
  end
  
	def update
		if !(@event.adminevent == true and current_user.admin != true)
	    @event = @calendar.events.find(params[:id])
	    respond_to do |format|
	      if @event.update_attributes(event_params)
          format.json { render json: @event, status: :created, location: [@user, @calendar, @event] } 
	      else
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
  
	def set_calendar
		@calendar = Calendar.find(params[:calendar_id])
	end
  
	def set_event
		@event = @calendar.events.find(params[:id])
	end

	def event_params
    params.require(:event).permit(:title, :start, :end, :allDay, :editable, :adminevent)
  end
  
end
