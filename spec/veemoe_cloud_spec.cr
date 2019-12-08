require "./spec_helper"

describe VeemoeCloud do
  it "works" do
    true.should eq(true)
  end

  describe VeemoeCloud::Router::Display do
    it "parse_conv" do
      format = VeemoeCloud::Router::Display.parse_conv("?conv.webp/resize.w_100")
      format.should eq(".webp")
    end
  end

  describe VeemoeCloud::Business::Workspace do
    it "find_by_name" do
      demo_space = VeemoeCloud::Business::Workspace.find_by_name("demo")
      demo_space.should be_nil
    end

    space = VeemoeCloud::Business::Workspace.create!({:name => "test-space", :description => "测试空间"})
    space.should be_truthy
    space.name.should eq("test-space")
    space.description.should eq("测试空间")

    begin
      VeemoeCloud::Business::Workspace.create!({:name => "demo", :description => "将要创建失败的空间。"})
    rescue e
      e.message.should eq("Unable to create directory '_res/demo': File exists")
    end

    space = VeemoeCloud::Business::Workspace.find_by_name("demo")
    space.should be_falsey

    space = VeemoeCloud::Business::Workspace.find_by_name("test-space")
    space.should be_truthy

    VeemoeCloud::Business::Workspace.update!(space.not_nil!, {:name => "test-space1"})
    File.exists?("_res/test-space1").should be_true

    VeemoeCloud::Business::Workspace.delete!("test-space1")

    space = VeemoeCloud::Business::Workspace.find_by_name("test-space1")
    space.should be_falsey

    File.exists?("_res/test-space1").should be_false
  end
end
