import { describe, it } from "@jest/globals";


describe("Say Hello",()=>{
  it("Greats",()=>{
    expect("Hello world").toEqual("Hello world");
  })
})