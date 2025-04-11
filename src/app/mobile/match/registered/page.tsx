import { MatchProvider } from './_components/context/match-context';
import { MatchContainer } from './_components/card/match-container';

export default function UserRegisterPage() {
  return (
    <MatchProvider>
      <MatchContainer />
    </MatchProvider>
  );
}
