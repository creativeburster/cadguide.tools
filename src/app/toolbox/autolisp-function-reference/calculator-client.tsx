'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'math', name: '🔢 Math & Logic' },
  { id: 'geo', name: '📐 Geometry' },
  { id: 'entity', name: '🏗️ Entity Access' },
  { id: 'list', name: '📋 List Operations' },
  { id: 'io', name: '💬 I/O & Command' },
  { id: 'sys', name: '⚙️ System & Variables' },
];

const SHORTCUTS = [
  // Math & Logic
  { keys: '(+ a b)', command: 'Addition', category: 'math', description: 'Returns sum of all arguments. (+ 2 3 4) → 9. Accepts integers and reals. Result type: integer if all args are integers, real if any arg is real.' },
  { keys: '(- a b)', command: 'Subtraction', category: 'math', description: 'Returns difference. (- 10 3 2) → 5. With one argument, negates: (- 5) → -5. Same type rules as +.' },
  { keys: '(* a b)', command: 'Multiplication', category: 'math', description: 'Returns product. (* 2 3 4) → 24. Same type rules as + and -.' },
  { keys: '(/ a b)', command: 'Division', category: 'math', description: 'Returns quotient. (/ 10 3) → 3 (integer division). (/ 10.0 3) → 3.33333 (real division). Use float arg for real result.' },
  { keys: '(1+ n)', command: 'Increment', category: 'math', description: 'Returns n + 1. (1+ 5) → 6. Works with integers and reals. Not the same as (+ n 1) — 1+ is a dedicated function.' },
  { keys: '(1- n)', command: 'Decrement', category: 'math', description: 'Returns n - 1. (1- 5) → 4. Works with integers and reals.' },
  { keys: '(abs n)', command: 'Absolute Value', category: 'math', description: 'Returns absolute value. (abs -5) → 5. (abs -5.5) → 5.5.' },
  { keys: '(sin ang)', command: 'Sine', category: 'math', description: 'Returns sine of angle in radians. (sin 0.0) → 0.0. (sin (/ pi 2)) → 1.0. Always returns real.' },
  { keys: '(cos ang)', command: 'Cosine', category: 'math', description: 'Returns cosine of angle in radians. (cos 0.0) → 1.0. (cos pi) → -1.0. Always returns real.' },
  { keys: '(atan a b)', command: 'Arctangent', category: 'math', description: 'With one arg: returns arctangent in radians. (atan 1.0) → 0.785398 (π/4). With two args: returns arctangent of a/b, handling quadrant correctly (like atan2 in C).' },
  { keys: '(sqrt n)', command: 'Square Root', category: 'math', description: 'Returns square root as real. (sqrt 16) → 4.0. Always returns real regardless of input type.' },
  { keys: '(expt base exp)', command: 'Exponent', category: 'math', description: 'Returns base raised to power exp. (expt 2 3) → 8. (expt 2.0 0.5) → 1.41421.' },
  { keys: '(gcd a b)', command: 'GCD', category: 'math', description: 'Returns greatest common divisor of two positive integers. (gcd 12 18) → 6. Arguments must be integers.' },
  { keys: '(rem a b)', command: 'Remainder', category: 'math', description: 'Returns remainder of integer division. (rem 10 3) → 1. Sign follows first argument.' },
  { keys: '(and a b)', command: 'Logical AND', category: 'math', description: 'Returns T if all arguments are non-nil, nil otherwise. Short-circuits on first nil. (and T T nil) → nil.' },
  { keys: '(or a b)', command: 'Logical OR', category: 'math', description: 'Returns T if any argument is non-nil, nil otherwise. Short-circuits on first non-nil. (or nil T nil) → T.' },
  { keys: '(not a)', command: 'Logical NOT', category: 'math', description: 'Returns T if argument is nil, nil otherwise. (not nil) → T. (not 5) → nil. Different from null — not works on any expression.' },
  { keys: '(= a b)', command: 'Equal', category: 'math', description: 'Returns T if all arguments are numerically equal. (= 5 5) → T. (= 5 5.0) → T. (= "abc" "abc") → T.' },
  { keys: '(/= a b)', command: 'Not Equal', category: 'math', description: 'Returns T if any pair of arguments is not equal. (/= 5 6) → T.' },
  { keys: '(< a b)', command: 'Less Than', category: 'math', description: 'Returns T if each argument is less than the next. (< 1 2 3) → T. Works with numbers and strings.' },
  { keys: '(> a b)', command: 'Greater Than', category: 'math', description: 'Returns T if each argument is greater than the next. (> 3 2 1) → T.' },
  { keys: '(<= a b)', command: 'Less or Equal', category: 'math', description: 'Returns T if each argument is less than or equal to the next. (<= 1 1 2) → T.' },
  { keys: '(>= a b)', command: 'Greater or Equal', category: 'math', description: 'Returns T if each argument is greater than or equal to the next. (>= 3 3 2) → T.' },

  // Geometry
  { keys: '(distance p1 p2)', command: 'Distance', category: 'geo', description: 'Returns 3D distance between two points. (distance \'(0 0 0) \'(3 4 0)) → 5.0. Points must be lists of 2 or 3 reals.' },
  { keys: '(angle p1 p2)', command: 'Angle', category: 'geo', description: 'Returns angle in radians from p1 to p2 (XY plane only). (angle \'(0 0) \'(1 0)) → 0.0. (angle \'(0 0) \'(0 1)) → 1.5708 (π/2).' },
  { keys: '(polar pt ang dist)', command: 'Polar Point', category: 'geo', description: 'Returns a point at given angle (radians) and distance from pt. (polar \'(0 0) 0.0 5.0) → (5.0 0.0). Extremely useful for calculating points in AutoLISP.' },
  { keys: '(inters l1p1 l1p2 l2p1 l2p2)', command: 'Intersection', category: 'geo', description: 'Returns intersection point of two lines defined by point pairs. Optional 5th arg nil extends lines. (inters \'(0 0) \'(10 10) \'(0 10) \'(10 0)) → (5.0 5.0).' },
  { keys: '(osnap pt mode)', command: 'Object Snap', category: 'geo', description: 'Returns snap point using OSNAP mode string. (osnap pt "midp") returns midpoint of nearest entity. Modes: "endp","midp","cen","int","nea","nod","qua","tan","per","ins","app". Returns nil if no snap found.' },
  { keys: '(angle p1 p2)', command: 'Angle in Radians', category: 'geo', description: 'Returns angle from p1 to p2 in radians (XY plane). To convert to degrees: (* (/ (angle p1 p2) pi) 180).' },
  { keys: '(cvunit val from to)', command: 'Unit Conversion', category: 'geo', description: 'Converts value between units. (cvunit 1 "inch" "mm") → 25.4. Uses acad.unt file. Supports distance, area, volume, angle, mass, and temperature units.' },
  { keys: '(trans pt from to)', command: 'Coordinate Transform', category: 'geo', description: 'Transforms point between coordinate systems. from/to can be: 0=WCS, 1=UCS, 2=DCS, or an entity name. (trans pt 1 0) converts from UCS to WCS.' },

  // Entity Access
  { keys: '(entget ename)', command: 'Get Entity Data', category: 'entity', description: 'Returns association list (DXF group codes) for entity. (entget (entlast)) returns data for last entity. Key codes: 0=type, 8=layer, 10=start point, 11=end point, 40=radius.' },
  { keys: '(entlast)', command: 'Last Entity', category: 'entity', description: 'Returns entity name of the last non-deleted entity in the drawing. Common pattern: (setq ent (entlast)) before creating entities to track them.' },
  { keys: '(entnext ename)', command: 'Next Entity', category: 'entity', description: 'Returns entity name of the next entity in the database. (entnext nil) returns first entity. Used to iterate through all entities. Returns nil at end.' },
  { keys: '(entmake datalist)', command: 'Make Entity', category: 'entity', description: 'Creates a new entity from DXF group code list. (entmake (list \'(0 . "CIRCLE") \'(8 . "0") \'(10 0.0 0.0 0.0) \'(40 . 5.0))). Faster than command for bulk creation.' },
  { keys: '(entmod datalist)', command: 'Modify Entity', category: 'entity', description: 'Modifies an entity using updated DXF group code list. Pattern: (setq ed (entget en)) (setq ed (subst (cons 8 "NewLayer") (assoc 8 ed) ed)) (entmod ed). Changes are immediate.' },
  { keys: '(entdel ename)', command: 'Delete Entity', category: 'entity', description: 'Deletes or undeletes an entity. (entdel en) deletes. Calling again with same ename undeletes. Cannot delete entities in blocks.' },
  { keys: '(entupd ename)', command: 'Update Entity', category: 'entity', description: 'Regenerates entity on screen after modification. Especially needed for polylines and complex entities after entmod. (entupd en) updates display.' },
  { keys: '(ssget mode pt1 pt2)', command: 'Selection Set', category: 'entity', description: 'Creates selection set. Modes: "C"=crossing, "W"=window, "L"=last, "P"=previous, "X"=all. (ssget \'(0 0) \'(10 10)) prompts user. (ssget "X" \'((0 . "CIRCLE"))) selects all circles.' },
  { keys: '(ssname ss index)', command: 'Get Entity from SS', category: 'entity', description: 'Returns entity name at index in selection set. (ssname ss 0) returns first entity. Index is 0-based. Use with ssadd/ssdel to manipulate sets.' },
  { keys: '(sslength ss)', command: 'Selection Set Length', category: 'entity', description: 'Returns number of entities in selection set. (sslength ss) → integer count. Use to iterate: (while (< i (sslength ss)) ...).' },
  { keys: '(ssadd ename ss)', command: 'Add to Selection Set', category: 'entity', description: 'Adds entity to selection set. (ssadd en ss) adds en to ss. If ss is nil, creates new selection set. Returns the selection set.' },
  { keys: '(ssdel ename ss)', command: 'Remove from Selection Set', category: 'entity', description: 'Removes entity from selection set. (ssdel en ss) removes en from ss. Returns ss if successful, nil if entity not in set.' },
  { keys: '(ssmemb ename ss)', command: 'Test Membership', category: 'entity', description: 'Returns ename if entity is in selection set, nil otherwise. (ssmemb en ss) checks if en is in ss.' },
  { keys: '(nentsel)', command: 'Nested Entity Select', category: 'entity', description: 'Prompts user to select entity, returns (ename pt). For nested entities (in blocks), returns the sub-entity, not the block reference. Useful for editing attributes and block contents.' },
  { keys: '(entsel)', command: 'Entity Select', category: 'entity', description: 'Prompts user to select single entity. Returns (ename pickpoint). (entsel "\\nSelect object: ") prompts with custom message.' },

  // List Operations
  { keys: '(list a b c)', command: 'Create List', category: 'list', description: 'Creates a list from arguments. (list 1 2 3) → (1 2 3). (list 0.0 0.0 0.0) creates a 3D point. Essential for coordinate data.' },
  { keys: '(car lst)', command: 'First Element', category: 'list', description: 'Returns first element of list. (car \'(1 2 3)) → 1. (car \'(5.0 3.0 0.0)) → 5.0 (X coordinate). nil for empty list.' },
  { keys: '(cdr lst)', command: 'Rest of List', category: 'list', description: 'Returns list without first element. (cdr \'(1 2 3)) → (2 3). nil for empty or single-element list.' },
  { keys: '(cadr lst)', command: 'Second Element', category: 'list', description: 'Returns second element. (cadr \'(1 2 3)) → 2. (cadr pt) → Y coordinate. Equivalent to (car (cdr lst)).' },
  { keys: '(caddr lst)', command: 'Third Element', category: 'list', description: 'Returns third element. (caddr \'(1 2 3)) → 3. (caddr pt) → Z coordinate. Equivalent to (car (cdr (cdr lst))).' },
  { keys: '(nth n lst)', command: 'Nth Element', category: 'list', description: 'Returns element at index n (0-based). (nth 2 \'(a b c d)) → c. Returns nil if index out of range.' },
  { keys: '(length lst)', command: 'List Length', category: 'list', description: 'Returns number of elements in list. (length \'(1 2 3 4)) → 4. Returns 0 for nil.' },
  { keys: '(append l1 l2)', command: 'Append Lists', category: 'list', description: 'Concatenates lists. (append \'(1 2) \'(3 4)) → (1 2 3 4). All arguments must be lists. (append nil \'(1)) → (1).' },
  { keys: '(reverse lst)', command: 'Reverse List', category: 'list', description: 'Returns list in reverse order. (reverse \'(1 2 3)) → (3 2 1). Useful for iterating backwards or building lists efficiently.' },
  { keys: '(assoc key alist)', command: 'Association Lookup', category: 'list', description: 'Searches association list for key. (assoc 8 (entget en)) returns (8 . "LayerName"). Essential for DXF group code access. Returns nil if not found.' },
  { keys: '(subst new old lst)', command: 'Substitute', category: 'list', description: 'Replaces all occurrences of old with new in list. (subst (cons 8 "NewLayer") (assoc 8 ed) ed) changes layer in entity data. Returns modified list.' },
  { keys: '(member expr lst)', command: 'Member Search', category: 'list', description: 'Returns tail of list starting from first occurrence of expr. (member \'b \'(a b c d)) → (b c d). Returns nil if not found.' },
  { keys: '(foreach item lst body)', command: 'For Each', category: 'list', description: 'Iterates over list, binding each element to item. (foreach pt ptlist (command "POINT" pt)). Executes body for each element.' },
  { keys: '(mapcar func l1 l2)', command: 'Map Function', category: 'list', description: 'Applies function to corresponding elements. (mapcar \'+ \'(1 2 3) \'(4 5 6)) → (5 7 9). Very powerful for coordinate transformations.' },

  // I/O & Command
  { keys: '(command "LINE" pt1 pt2 "")', command: 'Execute Command', category: 'io', description: 'Executes AutoCAD command with arguments. "" = Enter. (command "CIRCLE" center radius). Use "" for command termination. Non-nil args are passed as typed. Use pauses for user input.' },
  { keys: '(getpoint prompt)', command: 'Get Point', category: 'io', description: 'Prompts user to pick a point. Returns 3D point or nil. (getpoint "\\nPick a point: "). Optional base point arg: (getpoint basept prompt) rubber-bands from basept.' },
  { keys: '(getcorner basept prompt)', command: 'Get Corner', category: 'io', description: 'Prompts user to pick second corner, rubber-banding from basept. Returns 3D point. Used for window selection rectangles.' },
  { keys: '(getdist prompt)', command: 'Get Distance', category: 'io', description: 'Prompts user for distance. Accepts numeric input or two picks. Returns real. (getdist pt "\\nEnter radius: ") rubber-bands from pt.' },
  { keys: '(getangle prompt)', command: 'Get Angle', category: 'io', description: 'Prompts user for angle. Returns radians regardless of current ANGDIR/ANGBASE settings. (getangle pt "\\nEnter angle: ") rubber-bands from pt.' },
  { keys: '(getstring prompt)', command: 'Get String', category: 'io', description: 'Prompts user for string input. Returns string. (getstring T "\\nEnter description: ") — T allows spaces. Without T, input terminates at space.' },
  { keys: '(getint prompt)', command: 'Get Integer', category: 'io', description: 'Prompts user for integer input. Returns integer or nil. (getint "\\nEnter number of copies: ").' },
  { keys: '(getreal prompt)', command: 'Get Real', category: 'io', description: 'Prompts user for real number. Returns real or nil. (getreal "\\nEnter scale factor: ").' },
  { keys: '(getkword prompt)', command: 'Get Keyword', category: 'io', description: 'Prompts user for keyword from initget list. Must call (initget) first. (initget 1 "Yes No") (getkword "\\nContinue? [Yes/No]: ") → "Yes" or "No".' },
  { keys: '(initget bits kwords)', command: 'Initialize Input', category: 'io', description: 'Sets input options for next getxxx call. Bits: 1=no null, 2=no zero, 4=no negative, 8=no limits check, 32=use dashed lines, 64=disable Z. Keywords string: "Yes No Cancel".' },
  { keys: '(prompt msg)', command: 'Prompt Message', category: 'io', description: 'Displays message on command line. (prompt "\\nProcessing..."). Returns nil. Use \\n for new line. For dialog messages, use alert or msgbox.' },
  { keys: '(princ expr)', command: 'Print Clean', category: 'io', description: 'Prints expression without quotes or newlines. (princ "Hello") prints Hello. Returns its argument. Common in error handlers: (princ) suppresses return value display.' },
  { keys: '(print expr)', category: 'io', command: 'Print with Newline', description: 'Prints expression on new line with quotes for strings. (print "Hello") prints "Hello" on new line. Returns expression. Used for debugging.' },
  { keys: '(alert msg)', command: 'Alert Dialog', category: 'io', description: 'Displays modal dialog with message and OK button. (alert "File not found!"). Message limited to ~132 characters. Returns nil.' },

  // System & Variables
  { keys: '(getvar name)', command: 'Get System Variable', category: 'sys', description: 'Returns value of AutoCAD system variable. (getvar "DIMSCALE") → current dimscale. (getvar "CLAYER") → current layer name. Returns integer, real, string, or list.' },
  { keys: '(setvar name value)', command: 'Set System Variable', category: 'sys', description: 'Sets AutoCAD system variable. (setvar "OSMODE" 0) disables all osnaps. (setvar "CMDECHO" 0) suppresses command prompts. Always restore original values after use.' },
  { keys: '(set sym expr)', command: 'Set Symbol', category: 'sys', description: 'Sets value of quoted symbol. (set \'myvar 5) → 5. Rare — use setq instead. Useful when symbol name is computed at runtime.' },
  { keys: '(setq sym1 val1 sym2 val2)', command: 'Set Quote', category: 'sys', description: 'Most common assignment. (setq x 10 y 20 z 30) assigns multiple variables. Each pair: symbol (not quoted) and value. Returns last value.' },
  { keys: '(defun name args body)', command: 'Define Function', category: 'sys', description: 'Defines a function. (defun c:MYCMD () (alert "Hello")) creates command MYCMD. Args: (/ local vars) for locals, () for none. c: prefix makes it an AutoCAD command.' },
  { keys: '(lambda args body)', command: 'Lambda Function', category: 'sys', description: 'Anonymous function. (mapcar (lambda (x) (* x 2)) \'(1 2 3)) → (2 4 6). Used with mapcar and apply. No name — defined inline.' },
  { keys: '(apply func list)', command: 'Apply Function', category: 'sys', description: 'Calls function with list as arguments. (apply \'+ \'(1 2 3 4)) → 10. (apply \'strcat \'("a" "b" "c")) → "abc". Useful when argument count is dynamic.' },
  { keys: '(strcat s1 s2)', command: 'String Concatenate', category: 'sys', description: 'Concatenates strings. (strcat "Hello" " " "World") → "Hello World". All arguments must be strings. nil causes error.' },
  { keys: '(itoa n)', command: 'Integer to String', category: 'sys', description: 'Converts integer to string. (itoa 42) → "42". For reals, use (rtos n 2 2) → "42.00" (mode 2=decimal, precision 2).' },
  { keys: '(atoi s)', command: 'String to Integer', category: 'sys', description: 'Converts string to integer. (atoi "42") → 42. (atoi "42.9") → 42 (truncates). Returns 0 for non-numeric strings.' },
  { keys: '(atof s)', command: 'String to Real', category: 'sys', description: 'Converts string to real. (atof "42.5") → 42.5. Returns 0.0 for non-numeric strings.' },
  { keys: '(rtos n mode prec)', command: 'Real to String', category: 'sys', description: 'Converts real to formatted string. Mode: 1=scientific, 2=decimal, 3=engineering, 4=architectural, 5=fractional. (rtos 3.14159 2 2) → "3.14".' },
  { keys: '(strlen s)', command: 'String Length', category: 'sys', description: 'Returns length of string. (strlen "Hello") → 5. Returns 0 for empty string.' },
  { keys: '(substr s start len)', command: 'Substring', category: 'sys', description: 'Returns substring starting at position (1-based). (substr "Hello World" 7 5) → "World". Optional length arg; without it, returns to end.' },
  { keys: '(while test body)', command: 'While Loop', category: 'sys', description: 'Executes body while test is non-nil. (while (< i 10) (setq i (1+ i))). Returns value of last expression in body. Common for iteration.' },
  { keys: '(if test then else)', command: 'If Conditional', category: 'sys', description: 'Evaluates then if test is non-nil, else otherwise. (if (> x 0) "positive" "non-positive"). else is optional. Single expression per branch — use (progn) for multiple.' },
  { keys: '(cond (test1 result1) (test2 result2) (T default))', command: 'Cond Conditional', category: 'sys', description: 'Multi-branch conditional. Evaluates tests in order, returns first matching result. T as last test = default. (cond ((= x 1) "one") ((= x 2) "two") (T "other")).' },
  { keys: '(progn expr1 expr2)', command: 'Progn Block', category: 'sys', description: 'Groups multiple expressions into one. Used with if/while. (if test (progn (setq x 1) (setq y 2))). Returns value of last expression.' },
  { keys: '(repeat n body)', command: 'Repeat Loop', category: 'sys', description: 'Executes body n times. (repeat 5 (command "POINT" (getpoint))). Returns value of last evaluation. n is evaluated once at start.' },
  { keys: '(vl-load-com)', command: 'Load VLISP COM', category: 'sys', description: 'Loads Visual LISP COM extension. Required before using vlax, vla-, and vl- functions. Call once at start of script. Enables ActiveX automation and extended entity access.' },
];

const TIPS = [
  {
    title: 'Defun with c: prefix creates AutoCAD commands',
    content: 'A function named with the c: prefix becomes an AutoCAD command. (defun c:HELLO () (alert "Hi!")) lets you type HELLO at the command line. Local variables go after the slash: (defun c:MYCMD (/ pt rad) ...). Always use error handler (defun *error* msg ...) to restore system variables on exit.'
  },
  {
    title: 'Use entmake instead of command for bulk creation',
    content: 'When creating many entities, (entmake ...) is 10-100× faster than (command ...). entmake bypasses the command processor and writes directly to the drawing database. Pattern: build a DXF group code list with required codes (0=type, 8=layer, 10=point, etc.) and call (entmake list). No screen redraw needed during creation.'
  },
];

export default function AutoLispReferenceClient() {
  return (
    <ShortcutCheatsheetClient
      title="AutoLISP"
      subtitle="50+ AutoLISP functions for AutoCAD automation: math, geometry, entity access, selection sets, list operations, I/O, and system variables."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
