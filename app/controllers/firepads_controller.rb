class FirepadsController < ApplicationController
  
  before_action :get_firepad, except: [:create, :move]
  
  def create
    @groupfolder = current_group.groupfolders.find params[:groupfolder_id]
    if @groupfolder.firepads.create(firebase_url: random_key, name: 'New Firepad', groupfolder_id: params[:groupfolder_id], owner: current_user.id)
      render json: {id: @groupfolder.firepads.last.id}.to_json 
    end
  end
  
  def read
    @firepadRef = @firepad.firebase_url
  end
  
  def rename
    if @firepad.update(name: params[:name])
      render :nothing => true
    else 
      logger.info 'PROBLEME'
    end
  end
  
  def transfer
    @firepad = Firepad.find params[:item_id]
    @clone = @firepad.clone
    @attributes = {
      firebase_url: @clone.firebase_url, name: @clone.name, groupfolder_id: @clone.groupfolder_id, owner: @clone.owner
    }
    @transfered = Firepad.new(@attributes)
    @groupfolder = Groupfolder.where(["group_id = :group_id and parent_id = :parent_id", { group_id: params[:group_id], parent_id: 100 }]).first
    @transfered.groupfolder_id = @groupfolder.id
    @transfered.save
    render :nothing => true
  end
  
  def move
    @firepad = Firepad.find params[:dragged]
    @firepad.update(groupfolder_id: params[:dropped])
    render :nothing => true
  end
  
  def destroy
    @firepad.update(deleted: true)
    render :nothing => true
  end
  
  private

  def get_firepad
    @firepad = Firepad.find params[:firepad_id] if params[:firepad_id]
  end
  
end