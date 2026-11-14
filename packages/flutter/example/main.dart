// A row of Softstroke icons in both styles. Run it inside any Flutter app,
// or copy the Icon(...) lines into your own widgets.
import 'package:flutter/widgets.dart';
import 'package:softstroke/softstroke.dart';

void main() => runApp(const IconRow());

class IconRow extends StatelessWidget {
  const IconRow({super.key});

  @override
  Widget build(BuildContext context) {
    return const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(
        child: Wrap(
          spacing: 16,
          children: [
            Icon(SoftstrokeIcons.home, size: 32, color: Color(0xFF0F172A)),
            Icon(SoftstrokeIcons.homeSolid, size: 32, color: Color(0xFF2563EB)),
            Icon(SoftstrokeIcons.bell, size: 32, color: Color(0xFF0F172A)),
            Icon(SoftstrokeIcons.search,
                size: 32, color: Color(0xFF0F172A), semanticLabel: 'Search'),
          ],
        ),
      ),
    );
  }
}
