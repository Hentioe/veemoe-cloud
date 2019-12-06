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
end
