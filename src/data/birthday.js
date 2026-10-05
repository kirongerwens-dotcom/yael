export const BIRTHDAY = '2026-10-14';
export function berlinDate(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(now);
}
export const dailyLetters = [
 ['2026-10-04', 'Noch zehn Tage bis zu deinem Geburtstag. Ich denke heute wieder viel an dich. Am liebsten würde ich dir das direkt sagen. Bis dahin lasse ich dir hier jeden Tag ein paar Worte. Dieses kleine Stück von meinem Tag gehört dir.'],
 ['2026-10-05', 'Dein Name auf meinem Handy macht immer noch etwas mit mir. Ich schaue hin und freue mich. Auch wenn da nur eine kleine Nachricht steht. Ich mag, dass du so selbstverständlich zu meinem Tag gehörst. Und trotzdem nie selbstverständlich für mich bist.'],
 ['2026-10-06', 'Heute hätte ich dich gern neben mir. Ohne großen Plan und ohne besonderen Anlass. Einfach reden und irgendwann vergessen, wie spät es ist. Unsere Telefonate kommen dem manchmal ziemlich nah. Deine echte Nähe fehlt mir trotzdem.'],
 ['2026-10-07', 'Zwei Treffen klingt auf Papier nach wenig. In meinem Kopf sind das so viele kleine Momente. Ich denke gern an sie zurück. Noch lieber denke ich an unser nächstes Wiedersehen. Es gibt noch so viel, das ich mit dir erleben möchte.'],
 ['2026-10-08', 'Ich würde heute gern mit dir Sushi essen. Du würdest mir erzählen, was in deinem Tag passiert ist. Ich würde zuhören und zwischendurch einfach zu dir schauen. Wahrscheinlich wäre gar nichts Großes passiert. Für mich wäre es trotzdem ein schöner Tag.'],
 ['2026-10-09', 'Heute ist der Neunte. Seit dem 9. April gibt es dieses Wir. Ich mag, wie vertraut du mir geworden bist. Deine Stimme gehört inzwischen zu meinen liebsten Geräuschen. Ich bin so froh, dass aus unserem ersten Chat das hier geworden ist.'],
 ['2026-10-10', 'Manchmal schickst du mir einen völlig sinnlosen Snap. Und ich muss trotzdem lächeln. Vielleicht gerade deshalb. Ich möchte auch die kleinen Dinge aus deinem Leben mitbekommen. Die passen oft am besten in meinen Tag.'],
 ['2026-10-11', 'Ich freue mich auf gewöhnliche Tage mit dir. Zusammen etwas backen und dabei die Küche durcheinanderbringen. Oder irgendwo sitzen und nichts erledigen müssen. Wir brauchen dafür keinen perfekten Plan. Ich möchte einfach mehr Zeit neben dir.'],
 ['2026-10-12', 'Noch zwei Tage. Ich würde dir gern verraten, was hier auf dich wartet. Aber ein kleines bisschen Geduld brauche ich noch von dir. Bis dahin kannst du diese Worte immer wieder lesen. Ich liebe dich auch an den Tagen vor der Überraschung.'],
 ['2026-10-13', 'Morgen ist dein Geburtstag. Ich wäre so gern bei dir. Deshalb habe ich dir etwas gebaut, das auch von hier aus bei dir ankommen kann. Es steckt ziemlich viel von mir darin. Und noch viel mehr von dem, was du mir bedeutest.'],
].map(([date, text]) => ({ date, text }));
export function availableLetters(date) { return dailyLetters.filter(letter => letter.date <= date); }
export function nextCountdownTap(state, time) {
  if (state.count && time - state.started > 6000) state = { count: 0, started: 0 };
  return { count: state.count + 1, started: state.count ? state.started : time };
}
