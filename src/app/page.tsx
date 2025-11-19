import Image from "next/image";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";
 
export default function Home() {
  return (
    <div className="container ">
      <h1>hello there</h1>
      <Button variant="btn-primary" size="sm">
        hello there
      </Button>

      <TextInput
        label="hossam"
        name="one"
        value="one"
        prefix="/images/test.svg"
        suffix="/images/test.svg"
      />
    </div>
  );
}
