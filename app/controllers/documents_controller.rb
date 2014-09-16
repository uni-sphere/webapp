class DocumentsController < ApplicationController
  
  before_action :authenticate?
  before_action :document_params, only: [:create, :update]
  before_action :authenticate?, only: [:edit, :update, :index, :destroy]
  before_action :set_target, only: [:index, :new, :edit, :update, :create]
  before_action :set_document, only: [:edit, :update]
  before_filter :correct_target, only: [:index, :edit, :update, :destroy]

  def new
    @document = @target.documents.new
  end

  def create
    @document = @target.documents.new(document_params)
    respond_to do |format|
      if @document.save
        format.html { redirect_to user_documents_path }
        format.json { render action: 'show', status: :created, location: @document }
      else
        format.html { render action: 'new' }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def edit
  end

  def update
    respond_to do |format|
      if @document.update(document_params)
        format.html { redirect_to user_documents_path }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def index
    @documents = @target.documents.all
  end

  def destroy
    @document = Document.find(params[:id])
    @document.destroy
    respond_to do |format|
      format.html { redirect_to user_documents_path }
      format.json { head :no_content }
    end
  end

  private

  def set_target
    if request.original_url =~ /groups(.*)/
	    @target = Group.find(params[:group_id])  
	    @user = User.find(params[:user_id])
      correct_user?  	
    else
      @target = User.find(params[:user_id])
    end
  end

  def set_document
  	@document = @target.documents.find(params[:id])
  end

  def document_params
    params.require(:document).permit(:file)
  end
  
end
